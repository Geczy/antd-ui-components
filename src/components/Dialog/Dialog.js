import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import keymap from '../../utils/enums/keymap'
import { DialogHeader } from './DialogHeader'
import { Portal } from '../Portal'
import { Scale } from '../Animations/ScaleAnimation'
import { UseKeyDownListener } from '../../hooks/UseKeyDownListener'
import styles from './Dialog.module.scss'


const Dialog = ({ isOpen, className, onClose, disableBackdropClick, disableEscapeKeyDown, children, ...otherProps }) => {

  const classes = classNames(
    styles.dialog,
    className,
  )

  const onBackdropClick = event => !disableBackdropClick ? onClose(event) : null

  const onEscapeKeyDown = event => {
    event.stopPropagation()
    if (!disableEscapeKeyDown) {
      onClose(event)
    }
  }

  UseKeyDownListener({ [keymap.ESCAPE]: onEscapeKeyDown })

  return (
    <Portal containerId="dialog-container">
      { isOpen && <div className={ styles.backdrop } onClick={ onBackdropClick } data-testid={ 'backdrop' }/> }
      <Scale isOpen={ isOpen }>
        <div className={ classes } { ...otherProps } data-testid={ 'dialog' }>
          { children }
        </div>
      </Scale>
    </Portal>
  )
}

Dialog.defaultProps = {
  isOpen: false,
  onClose: () => {},
  disableBackdropClick: false,
  disableEscapeKeyDown: false
}

Dialog.propTypes = {
  /** For css customization */
  className: propTypes.string,
  /** Dialog components */
  children: propTypes.node,
  /** Should the dialog appear on screen or not */
  isOpen: propTypes.bool.isRequired,
  /** A callback triggered whenever the menu is closed */
  onClose: propTypes.func,
  /** Disable onClose firing when backdrop is clicked */
  disableBackdropClick: propTypes.bool,
  /** Disable onClose firing when escape button is clicked */
  disableEscapeKeyDown: propTypes.bool
}

Dialog.DialogHeader = DialogHeader

export default Dialog
