import React from "react"
import { SortableElement, SortableHandle } from "react-sortable-hoc"
import styled from "styled-components"
import { getTabContainerStyle } from "./utils"
import { activeTabFlagsInterface } from "./types"
import { Icon } from "../"
import { getThemeColor } from "../../common/_utils"
const VerticalBar = styled.div`
  height: 14px;
  width: 0px;
  position: absolute;
  border-right: 1px solid #cccccc;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  pointer-events: none;
`

type TabItemType = {
  value: any
  onChange: (activeKey: string) => void
  activeKey: string | null
  activeKeyIndex: number
  itemIndex: number
  activeTabFlags: activeTabFlagsInterface
  itemRef: React.RefObject<HTMLDivElement>
  activeNxtRef: React.RefObject<HTMLDivElement>
  activePrevRef: React.RefObject<HTMLDivElement>
  dragHandle: boolean
  dragHandleElement: React.FC<any> | null
  readOnly: boolean
}

const DragIcon = styled(Icon)`
  cursor: grab;
  & svg {
    fill: ${props => getThemeColor(props, "Neutral45")};
  }
  margin-right: 0.4rem;
  & svg :hover,
  & svg :active,
  & svg :focus {
    fill: #000000;
  }
`

export const TabDragElement = SortableHandle(({ children }) => children)

export const TabItem = SortableElement(
  ({
    value,
    onChange,
    activeKey,
    activeKeyIndex,
    itemIndex,
    activeTabFlags,
    itemRef,
    activeNxtRef,
    activePrevRef,
    dragHandle,
    dragHandleElement: DragHandleElement,
    readOnly,
  }: TabItemType) => {
    const props = value.props
    const isActive = props.tabKey === activeKey

    const handleElement =
      dragHandle && isActive && !readOnly ? (
        <TabDragElement>
          {DragHandleElement ? (
            <DragHandleElement />
          ) : (
            <DragIcon type="oDragIndicator" size="16px" />
          )}
        </TabDragElement>
      ) : null

    const elem = React.cloneElement(value, {
      key: props.tabKey,
      active: isActive,
      dragHandle: dragHandle,
      role: "tab",
      "aria-controls": "tabpanel-id",
      children: [handleElement, props.tab],
      onClick: () => !isActive && onChange(props.tabKey),
    })
    const showVBar = itemIndex + 1 !== activeKeyIndex && !isActive
    let styles = getTabContainerStyle(
      activeTabFlags,
      activeKeyIndex,
      itemIndex,
      itemRef
    )
    const getRef = () => {
      if (activeKeyIndex === itemIndex) {
        return itemRef
      } else if (activeKeyIndex + 1 === itemIndex) {
        return activeNxtRef
      } else if (activeKeyIndex - 1 === itemIndex) {
        return activePrevRef
      }
      return null
    }
    return (
      <div ref={getRef()} id={isActive ? "knit-active-tab" : ""} style={styles}>
        {elem}
        {showVBar ? <VerticalBar tabIndex={-1} /> : null}
      </div>
    )
  }
)
