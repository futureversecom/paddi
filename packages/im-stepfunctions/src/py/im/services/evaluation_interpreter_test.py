
import os
import pathlib

from im.services.evaluation_interpreter import EvaluationInterpreter
from schemas.segments.histogram_stats import HistogramStats


class TestEvaluationInterpreter:
    def setup_class(self) -> None:
        current_path = pathlib.Path(os.path.dirname(os.path.realpath(__file__)))
        replay_file_path = current_path / "../../../../tests/resources/miss_replay.jsonl"

        self.interpreter = EvaluationInterpreter()
        self.results = self.interpreter.interpret(str(replay_file_path))

    def test_all_results(self) -> None:
        assert len(self.results) == 4

    def test_miss_result(self) -> None:
        result = list(filter(lambda r: r.name == 'ResultsDistribution', self.results))

        expected = HistogramStats(
            type='histogram',
            name='ResultsDistribution',
            x_axis='Results',
            y_axis='Count',
            categories=['right'], data=[11.0])

        assert len(result) == 1
        assert result[0] == expected

    def test_survival_time(self) -> None:
        result = list(filter(lambda r: r.name == 'SurvivalTimeDistribution', self.results))
        expected = HistogramStats(
            type='histogram',
            name='SurvivalTimeDistribution',
            x_axis='Survival Time (seconds)',
            y_axis='Count',
            categories=['0.0', '1.0', '2.0', '4.0'],
            data=[1.0, 5.0, 2.0, 3.0])

        assert len(result) == 1
        assert result[0] == expected

    def test_missed_distance(self) -> None:
        result = list(filter(lambda r: r.name == 'MissedDistanceDistribution', self.results))
        expected = HistogramStats(
            type='histogram',
            name='MissedDistanceDistribution',
            x_axis='Missed Distance',
            y_axis='Count',
            categories=['10.0', '20.0', '40.0'],
            data=[1.0, 2.0, 1.0])

        assert len(result) == 1
        assert result[0] == expected

    def test_endurance_time(self) -> None:
        result = list(filter(lambda r: r.name == 'EnduranceTimeDistribution', self.results))
        expected = HistogramStats(
            type='histogram',
            name='EnduranceTimeDistribution',
            x_axis='Endurance Remaining',
            y_axis='Count',
            categories=['60.0', '70.0', '80.0', '90.0', '100.0'],
            data=[45.0, 81.0, 231.0, 398.0, 474.0])

        assert len(result) == 1
        assert result[0] == expected
