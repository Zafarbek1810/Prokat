import { Popover, Tooltip } from "antd";

const TrimTextWithTooltip = ({ text = "", length = 60, type = "popover" }) => {
  if(type === "popover") {
    return text.length <= length ? text : (
      <Popover content={<div style={{maxWidth: "500px"}}>{text}</div>}>
        <div className="ellipsis_two_line">{text}</div>
      </Popover>
    )
  }
  return text.length <= length ? text : (
    <Tooltip title={text}>
      <div className="ellipsis_two_line">{text}</div>
    </Tooltip>
  )
}

export default TrimTextWithTooltip;
