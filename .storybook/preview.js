import { addParameters, addDecorator } from '@storybook/react'

addParameters({
  options: {
    storySort: {
      order: ['Style', 'Icons', 'User Inputs', 'Content', 'User Feedback'],
    },
  },
  controls: { hideNoControlsWarning: true },
})
