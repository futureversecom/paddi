import type { SelectChangeEvent } from '@mui/material'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
} from '@mui/material'
import type { FC } from 'react'

type SelectProps = {
  tooltip?: string
  label: string
  min?: number
  max?: number
  value?: number
  onChange?: (event: SelectChangeEvent<number>) => void
  invertDisplayValue?: boolean
  itemTextInterpolate?: (num: number) => string
}

export const SelectWithRange: FC<SelectProps> = ({
  tooltip,
  label,
  min = 0,
  max = 10,
  value = 5,
  onChange,
  invertDisplayValue = false,
  itemTextInterpolate,
}) => {
  const disabled = !onChange
  return (
    <FormControl fullWidth>
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Stack direction="row" alignItems="center" gap={1}>
        <Select
          labelId={`${label}-label`}
          label={label}
          value={value}
          onChange={onChange}
          style={{ width: '100%' }}
          disabled={disabled}
        >
          {Array(max - min + 1)
            .fill(0)
            .map((_, i) => {
              const num = invertDisplayValue ? -(i + min) : i + min
              const text = itemTextInterpolate ? itemTextInterpolate(num) : num
              return (
                // eslint-disable-next-line react/no-array-index-key
                <MenuItem key={`${label}-${i}`} value={i + min}>
                  {text}
                </MenuItem>
              )
            })}
        </Select>
        <Tooltip title={tooltip} placement="top-start">
          <span className="material-symbols-outlined">help</span>
        </Tooltip>
      </Stack>
    </FormControl>
  )
}
