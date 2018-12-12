import * as R from 'ramda'
import { useReducer } from 'react'

import TestRunnerView from './TestRunnerView'

/*
  This class handles the stateful side of running tests, allowing the views to
  remain stateless.
 */
const TestRunner = ({ tests }) => {
  const [state, dispatch] = useReducer(reducer, {
    tests,
    started: false
  })
  const handleStart = () => {
    dispatch({ type: 'suiteRunning' })
    tests.forEach(test => {
      dispatch({ type: 'testRunning', test })
      test.run(result =>
        dispatch({ type: 'testFinished', test, didPass: result })
      )
    })
  }

  return (
    <TestRunnerView
      tests={state.tests}
      started={state.started}
      handleStart={handleStart}
    />
  )
}

function reducer(state, action) {
  switch (action.type) {
    case 'suiteRunning':
      return { ...state, started: true }
    case 'suiteFinished':
      return { ...state, started: false }
    case 'testRunning':
      return {
        ...state,
        tests: updateTest('Running', action.test, state.tests)
      }
    case 'testFinished':
      return {
        ...state,
        tests: updateTest(
          action.didPass ? 'Passed' : 'Failed',
          action.test,
          state.tests
        )
      }
    default:
      return state
  }
}

function updateTest(status, test, tests) {
  const index = R.findIndex(R.whereEq({ description: test.description }))(tests)
  const updatedTests = R.update(index, { ...test, status }, tests)
  return updatedTests
}

export default TestRunner
