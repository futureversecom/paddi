import json
from dataclasses import dataclass
from typing import Generic, List, Type, TypeVar, Union, cast

import pandas as pd
from pandasql.sqldf import PandaSQL
from pydantic import BaseModel
from schemas.segments.aggregation_stats import AggregationStats
from schemas.segments.histogram_stats import HistogramStats
from typing_extensions import assert_never


class ResultsTable:
    """Represents the results table in the database, with the table name 'results'."""

    def __init__(self, results_df: pd.DataFrame):
        self.results_df = results_df

        # This instance need to be created for every execution as it may persist state
        # between interpretations, effecting the results.
        # we set persist to true so the DataFrame could be cached between calls
        self.panda_sql = PandaSQL(persist=True)

    def __call__(self, query: str) -> pd.DataFrame:
        res = self.panda_sql(query, env={'results': self.results_df})
        return cast(pd.DataFrame, res)


class InterpretationRecordBase(BaseModel):
    pass


class HistogramInterpretationRecord(InterpretationRecordBase):
    """Represents a record in the histogram interpretation."""
    category: str
    data: float


class AggregationInterpretationRecord(InterpretationRecordBase):
    """Represents a record in the aggregation interpretation."""
    data: float


InterpretationRecord = Union[HistogramInterpretationRecord, AggregationInterpretationRecord]


TR = TypeVar('TR', bound=InterpretationRecordBase)


class InterpretationQueryBase(Generic[TR]):
    stat_name: str
    model: Type[TR]
    query: str


@dataclass
class HistogramInterpretationQuery(InterpretationQueryBase[HistogramInterpretationRecord]):
    name: str
    x_axis: str
    y_axis: str
    query: str
    model: Type[HistogramInterpretationRecord] = HistogramInterpretationRecord


@dataclass
class AggregationQuery(InterpretationQueryBase[AggregationInterpretationRecord]):
    name: str
    query: str
    model: Type[AggregationInterpretationRecord] = AggregationInterpretationRecord


InterpretationQuery = Union[HistogramInterpretationQuery, AggregationQuery]

survival_time = HistogramInterpretationQuery(
    name="SurvivalTimeDistribution",
    x_axis="Survival Time (seconds)",
    y_axis="Count",
    query="""
        SELECT survival_seconds AS category, count() AS data
        FROM (
            SELECT ROUND((max(frame_index) / 60), 0) AS survival_seconds
            FROM results
            WHERE event_type in ('PaddleFrameEvent', 'BallCollisionEvent')
            GROUP BY turn_index
        ) as survival
        GROUP BY survival_seconds
    """
)


missed_distance = HistogramInterpretationQuery(
    name="MissedDistanceDistribution",
    x_axis="Missed Distance",
    y_axis="Count",
    query="""
            SELECT
                ROUND(
                    ABS(bc.[position.y] - paddle_pos.[paddle_l.position.y]) * 10,
                    0
                ) * 10 AS category,
                count() AS data
            FROM  results bc
            INNER JOIN results paddle_pos
                    ON bc.turn_index = paddle_pos.turn_index
                    AND bc.frame_index = paddle_pos.frame_index
            WHERE   bc.event_type = 'BallCollisionEvent'
                    AND paddle_pos.event_type = 'PaddleFrameEvent'
                    AND bc.collision_type = 'left'
            GROUP BY ROUND(ABS(bc.[position.y] - paddle_pos.[paddle_l.position.y]) * 10, 0) * 10
        """
)

endurance_time = HistogramInterpretationQuery(
    name="EnduranceTimeDistribution",
    x_axis="Endurance Remaining",
    y_axis="Count",
    query="""
            SELECT ROUND(r.[paddle_l.endurance] * 10, 0) * 10 AS category, count() AS data
            FROM results as r
            WHERE event_type = 'PaddleFrameEvent'
            GROUP BY  ROUND(r.[paddle_l.endurance] * 10, 0) * 10
        """
)

results_distribution = HistogramInterpretationQuery(
    name="ResultsDistribution",
    x_axis="Results",
    y_axis="Count",
    query="""
            SELECT result AS category, count() as data
            FROM results
            WHERE event_type = 'TurnEndEvent'
            GROUP BY result
        """
)

interpretations_queries = [
    survival_time,
    missed_distance,
    endurance_time,
    results_distribution,
]


class EvaluationInterpreter:
    """Takes an evaluation replay file and interprets statistics from it."""

    def _load_replay(self, replay_file_path: str) -> ResultsTable:
        """Loads the replay file into a pandas DataFrame and creates a ResultsTable instance that
        can be used to query the results table."""
        with open(replay_file_path) as f:
            lines = f.read().splitlines()

        inter_df = pd.DataFrame(lines, columns=['json_element'])
        # Ignoring type here as json.loads is not typed
        results_df = pd.json_normalize(inter_df['json_element'].apply(json.loads))
        # Fill turn index down, so that we can join on it later on
        results_df['turn_index'].fillna(method='ffill', inplace=True)

        return ResultsTable(results_df)

    def run_query(
            self,
            results_table: ResultsTable,
            query: InterpretationQuery) -> List[InterpretationRecord]:
        """Runs the given query on the results table and returns the result."""
        # run query
        results = results_table(query.query)

        # validated records
        return [query.model.parse_obj(record) for record in results.to_dict('records')]

    def prepare_results(
            self,
            records: List[InterpretationRecord],
            query: InterpretationQuery) -> Union[HistogramStats, AggregationStats]:
        """Runs the given query on the results table and returns the result."""
        if isinstance(query, HistogramInterpretationQuery):
            return HistogramStats(
                type="histogram",
                name=query.name,
                x_axis=query.x_axis,
                y_axis=query.y_axis,
                categories=[
                    cast(HistogramInterpretationRecord, record).category for record in records
                ],
                data=[record.data for record in records],
            )
        elif isinstance(query, AggregationQuery):
            return AggregationStats(
                type="aggregation",
                name=query.name,
                data=records[0].data,
            )
        else:
            return assert_never(query)

    def run_interpretation(
        self,
        results_table: ResultsTable,
        query: InterpretationQuery
    ) -> Union[HistogramStats, AggregationStats]:
        """Runs the given query on the results table and returns the result."""
        records = self.run_query(results_table, query)
        return self.prepare_results(records, query)

    def interpret(self, replay_file_path: str) -> List[Union[HistogramStats, AggregationStats]]:
        """Interprets the given replay file and returns a dictionary of statistics."""
        results_table = self._load_replay(replay_file_path)

        interpretations = []

        for query in interpretations_queries:
            result = self.run_interpretation(results_table, query)
            interpretations.append(result)

        print('first-record', interpretations)

        return interpretations
