import { css, styled } from '@mui/material'

export const StepButton = styled('button')<{ $selected: boolean }>(
  ({ $selected }) => css`
    position: relative;
    overflow: hidden;
    display: flex;
    padding-top: 65px;
    font-size: 24px;
    text-align: center;
    width: 100%;
    height: 240px;
    margin-bottom: 20px;
    flex-direction: column;
    align-items: center;
    border: 1px solid #a4a4a4;
    border-radius: 8px;
    cursor: pointer;
    background: none;
    color: ${$selected ? '#fff' : '#8E8E8E'};
    ::after {
      position: absolute;
      top: 15px;
      right: 15px;
      z-index: 2;
      display: ${$selected ? 'block' : 'none'};
      content: 'check';
      font-family: 'Material Symbols Outlined';
      font-size: 24px;
      line-height: 1;
      background-color: green;
      border-radius: 100%;
      color: black;
    }
  `,
)
