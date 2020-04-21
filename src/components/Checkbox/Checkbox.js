import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { ReactComponent as CheckboxChecked } from '../../assets/svg/CheckboxChecked.svg'
import { ReactComponent as CheckboxIndeterminate } from '../../assets/svg/CheckboxIndeterminate.svg'
import colors from '@anyvision/style-guide/abstracts/_colors.scss'
import styles from './Checkbox.module.scss'

const styleGuideColors = Object.keys(colors)

const Checkbox = ({ color, checked, indeterminate, disabled, onChange, className, id }) => {
  const classes = classNames(
    styles.checkbox,
    styles[color],
    styles[`checkbox-${color}`],
    className,
    checked && styles.checked,
    indeterminate && styles.indeterminate,
    disabled && styles.isDisabled
  )

  const renderCheckboxIcon = () => {
    if (checked) {
      return <CheckboxChecked />
    }
    if (indeterminate) {
      return <CheckboxIndeterminate />
    }
    return null
  }


  return (
    <label className={ classes }>
      <input
        type='checkbox'
        className={ styles.parent }
        checked={ checked }
        disabled={ disabled }
        ref={ el => el && (el.indeterminate = indeterminate) }
        onChange={ onChange }
        id={ id }
      />
      <span className={ styles.iconContainer }>
        { renderCheckboxIcon() }
      </span>
    </label>
  )
}

Checkbox.defaultProps = {
  color: 'primary',
  disabled: false,
  checked: false,
  indeterminate: false,
  onChange: () => {}
}

Checkbox.propTypes = {
  /** The color of the button. */
  color: propTypes.oneOf(styleGuideColors),
  /** If true, the button will be disabled. */
  disabled: propTypes.bool,
  /** For css customization. */
  className: propTypes.string,
  /** Whether the checkbox is checked, or not. */
  checked: propTypes.bool,
  /** Whether the checkbox is indeterminate, or not. */
  indeterminate: propTypes.bool,
  /** Form control ID - for label association. */
  id: propTypes.string,
  /** Callback when changed. */
  onChange: propTypes.func,
}

export default Checkbox
