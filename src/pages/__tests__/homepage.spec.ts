import Homepage from '../homepage.vue'
import { fireEvent } from '@testing-library/vue'
import { renderWithVuetify } from '@/../test/helpers'

describe('homepage', () => {
  it('Notify correctly', async () => {
    const { getByText, getByLabelText } = renderWithVuetify(Homepage)
  })
})
