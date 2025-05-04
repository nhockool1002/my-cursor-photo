import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders the app', () => {
    const { getByTestId } = render(<App />)
    expect(getByTestId('app')).toBeInTheDocument()
  })
}) 