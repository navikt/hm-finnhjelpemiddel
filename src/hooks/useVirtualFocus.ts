import { useCallback, useState } from 'react'

function useVirtualFocus(containerRef: HTMLElement | null) {
  const [index, setIndex] = useState(-1)

  const getElementsAbleToReceiveFocus = () => {
    const listOfAllChildren: HTMLElement[] = containerRef?.children
      ? Array.prototype.slice.call(containerRef?.children)
      : []
    return listOfAllChildren.filter((child) => child.getAttribute('data-no-focus') !== 'true')
  }

  const reset = useCallback(() => {
    setIndex(-1)
  }, [])

  const scrollToOption = (newIndex: number) => {
    const indexOfElementToScrollTo = Math.min(Math.max(newIndex, 0), containerRef?.children.length || 0)
    if (containerRef?.children[indexOfElementToScrollTo]) {
      const child = containerRef.children[indexOfElementToScrollTo]
      const { top, bottom } = child.getBoundingClientRect()
      const parentRect = containerRef.getBoundingClientRect()
      if (top < parentRect.top || bottom > parentRect.bottom) {
        child.scrollIntoView({ block: 'nearest' })
      }
    }
  }

  const _moveFocusAndScrollTo = (_index: number) => {
    setIndex(_index)
    scrollToOption(_index)
  }
  const moveFocusUp = () => _moveFocusAndScrollTo(Math.max(index - 1, -1))
  const moveFocusDown = () => _moveFocusAndScrollTo(Math.min(index + 1, getElementsAbleToReceiveFocus().length - 1))
  const moveFocusToTop = () => _moveFocusAndScrollTo(-1)
  const moveFocusToBottom = () => _moveFocusAndScrollTo(getElementsAbleToReceiveFocus().length - 1)
  const moveFocusToElement = (id: string | HTMLElement) => {
    const elementsAbleToReceiveFocus = getElementsAbleToReceiveFocus()
    const thisElement =
      typeof id === 'string' ? elementsAbleToReceiveFocus.find((_element) => _element.getAttribute('id') === id) : id
    const indexOfElement = thisElement ? elementsAbleToReceiveFocus.indexOf(thisElement) : -1
    if (indexOfElement >= 0) {
      _moveFocusAndScrollTo(indexOfElement)
    }
  }

  const elementsAbleToReceiveFocus = getElementsAbleToReceiveFocus()

  return {
    reset,
    activeElement: elementsAbleToReceiveFocus[index],
    isFocusOnTheTop: index === 0,
    moveFocusUp,
    moveFocusDown,
    moveFocusToElement,
    moveFocusToTop,
    moveFocusToBottom,
  }
}

export default useVirtualFocus
