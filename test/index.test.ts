import { assert } from 'vitest'
import { name } from '../src'

it('simple', () => {
  assert.equal(name, 'vite-plugin-resolve-adapter')
})
