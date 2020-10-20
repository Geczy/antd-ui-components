import React, { useCallback, useEffect, useState, useRef } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { MenuItem } from './MenuItem'
import { SubMenu } from './SubMenu'
import keymap from "../../utils/enums/keymap"
import { useClickOutsideListener } from '../../hooks'
import { Animations } from '../Animations'
import { Portal } from '../Portal'
import styles from './Menu.module.scss'
import { usePopper } from "react-popper"

const Menu = ({
  isOpen,
  variant,
  className,
  anchorElement,
  children,
  preferOpenDirection,
  isSubMenu,
  onClose,
  onClosed,
  onOpened,
  ...otherProps
}) => {
  const [ currentFocus, setCurrentFocus ] = useState(false)
  const [ popperRef, setPopperRef ] = useState(null)
  const [ isMenuOpen, setIsMenuOpen ] = useState(isOpen || false)
  const sideToOpenFrom = useRef(null)
  const positionToOpenFrom = useRef(null)

  const { styles: popperStyles, attributes, update: updatePopper } = usePopper(
    anchorElement,
    popperRef,
    {
      placement: preferOpenDirection,
      modifiers: [
        { name: 'offset', options: [ 0, 4 ] }
      ]
    }
  )

  useEffect(() => {
    setIsMenuOpen(isOpen)
  }, [ isOpen ])

  const handleOnAnchorClick = useCallback(() => setIsMenuOpen(true), [])

  useEffect(() => {
    async function update() {
      if (anchorElement && updatePopper) {
        anchorElement.onclick = handleOnAnchorClick
        await updatePopper()
      }
    }
    update()
  }, [ anchorElement, handleOnAnchorClick, updatePopper ])

  
  useEffect(() => {
    const [side, position] = preferOpenDirection.split('-')
    sideToOpenFrom.current = side
    positionToOpenFrom.current = position === undefined ? 'center' : position
  }, [preferOpenDirection])



  useClickOutsideListener(event => {
    if (!isMenuOpen || (anchorElement && anchorElement.contains(event.target))) {
      return
    }
    if (isOpen === undefined) {
      setIsMenuOpen(false)
    }
    onClose(event)
  }, { current: popperRef })

  const handleKeyDown = useCallback(event => {
    const nextFocus = (nextFocusDirection, firstFocus) => {
      if (!currentFocus) {
        const focusItem = popperRef.firstChild[ firstFocus ]
        focusItem.focus()
        setCurrentFocus(focusItem)
      }
      else if (!currentFocus[ nextFocusDirection ]) {
        anchorElement.focus()
        setCurrentFocus(null)
      }
      else if (currentFocus[ nextFocusDirection ]) {
        const focusItem = currentFocus[ nextFocusDirection ]
        focusItem.focus()
        setCurrentFocus(focusItem)
      }
    }

    switch (event.keyCode) {
    case keymap.ARROW_DOWN:
      nextFocus('nextElementSibling', 'firstChild')
      break
    case keymap.ARROW_UP:
      nextFocus('previousElementSibling', 'lastChild')
      break
    case keymap.ESCAPE:
      onClose()
      break
    default:
      break
    }
  }, [ popperRef, currentFocus, anchorElement, onClose ])

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown)
    } else {
      setCurrentFocus(null)
      document.removeEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [ isMenuOpen, handleKeyDown ])

  const renderMenuList = () => (
    <ul
      role="menu"
      className={ menuClasses }
      { ...otherProps }
    >
      { children }
    </ul>
  )

  const containerClasses = classNames(
    styles.menuContainer,
    isSubMenu && styles.subMenu,
  )
  const menuClasses = classNames(
    styles.menu,
    styles[ variant ],
    className,
  )

  const sideToOpenTo = {
    top: 'bottom',
    bottom: 'top',
    right: 'left',
    left: 'right'
  }

  const renderMenu = () => (
    <div
      ref={ setPopperRef }
      className={ containerClasses }
      style={ popperStyles.popper }
      { ...attributes.popper }
    >
      <Animations.Scale
        isOpen={ isMenuOpen || false }
        onEnter={ () => onOpened() }
        onExited={ () => onClosed() }
        horizontalStart={ positionToOpenFrom.current }
        verticalStart = { sideToOpenTo[sideToOpenFrom] }
      >
        { renderMenuList() }
      </Animations.Scale>
    </div>
  )

  const renderMenuInPortal = () => (
    <Portal containerId="menu-container">
      { renderMenu() }
    </Portal>
  )

  return !isSubMenu
    ? renderMenuInPortal()
    : renderMenu()
}

Menu.defaultProps = {
  variant: 'regular',
  onClose: () => { },
  onClosed: () => { },
  onOpened: () => { },
  isSubMenu: false,
  preferOpenDirection: 'bottom-start'
}

Menu.propTypes = {
  /** Should the menu appear on screen or not. */
  isOpen: propTypes.bool,
  /** Determine the size of the menu's items. */
  variant: propTypes.oneOf([ 'regular', 'dense' ]),
  /** Reference to the controlling element,
   *  used to attached the to the menu to the controller which causes it to open. */
  anchorElement: propTypes.oneOfType([
    propTypes.func,
    propTypes.shape({ current: propTypes.any }),
  ]),
  /** Determine whether the menu should be attached to
   *  the controlling element from the side, or top/bottom. */
  attachAxis: propTypes.oneOf([ 'vertical', 'horizontal' ]),
  /** Add custom styling to the menu. */
  className: propTypes.string,
  /** Menu items (Menu.Item) or sub menus (Menu.SubMenu). */
  children: propTypes.node.isRequired,
  /** A callback triggered whenever the user is clicking outside the menu scope. */
  onClose: propTypes.func,
  /** A callback triggered after the menu is opened. */
  onOpened: propTypes.func,
  /** A callback triggered after the menu is closed. */
  onClosed: propTypes.func,
  /** Force the menu to open <b>to</b> a certain side.<br />
   * <code>top-start</code> - means that the menu will open on the top-side-left<br />
   * <code>top</code> - means that the menu will open in the top-side-center<br />
   * <code>top-end</code> - means that the menu will open in the top-side-right<br />
   * <code>right-start</code> - means that the menu will open in the right-side-top<br />
   * <code>right</code> - means that the menu will open in the right-side-center<br />
   * <code>right-end</code> - means that the menu will open in the right-side-bottom<br />
   * <code>bottom-start</code> - means that the menu will open in the bottom-side-left<br />
   * <code>bottom</code> - means that the menu will open in the bottom-side-center<br />
   * <code>bottom-end</code> - means that the menu will open in the bottom-side-right<br />
   * <code>left-start</code> - means that the menu will open in the left-side-top<br />
   * <code>left</code> - means that the menu will open in the left-side-center <br />
   * <code>left-end</code> - means that the menu will open in the left-side-bottom<br />
  
   * */
  preferOpenDirection: propTypes.oneOf([
    'top-start',
    'top',
    'top-end',
    'right-start',
    'right',
    'right-end',
    'bottom-start',
    'bottom',
    'bottom-end',
    'left-start',
    'left',
    'left-end',
  ]),
  /** <code>INTERNAL</code> Is the menu is in-fact a sub menu.
   * Is set internally by <code>Menu.SubMenu</code> */
  isSubMenu: propTypes.bool,
}

Menu.Item = MenuItem
Menu.SubMenu = SubMenu

export default Menu
