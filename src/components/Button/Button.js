import React, { forwardRef } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import styles from './Button.module.scss'
import { Button as AntButton } from 'antd'

/**
 * Buttons allow users to take actions, and make choices, with a single tap.
 **/

const Button = forwardRef(
  (
    {
      size,
      type,
      leadingIcon,
      disabled,
      onClick,
      children,
      ...otherProps
    },
    ref,
  ) => {
    return (
      <AntButton
        size={size}
        onClick={onClick}
        disabled={disabled}
        ref={ref}
        type={type}
        {...otherProps}
      >
        {leadingIcon && (
          <span className={styles.leadingIcon}>{leadingIcon}</span>
        )}
        {children}
      </AntButton>
    )
  },
)

Button.defaultProps = {
  size: 'medium',
  type: 'fill',
  disabled: false,
  onClick: () => {},
}

Button.propTypes = {
  /** The size of the button. */
  size: propTypes.oneOf(['small', 'middle', 'large']),
  /** The type of the button. */
  type: propTypes.oneOf(['dashed', 'outline', 'ghost']),
  /** Icon before the children. */
  leadingIcon: propTypes.element,
  /** If true, the button will be disabled. */
  disabled: propTypes.bool,
  /** Callback when click. */
  onClick: propTypes.func,
  /** For css custoization. */
  /** The component content. */
  children: propTypes.node.isRequired,
}

export default Button
