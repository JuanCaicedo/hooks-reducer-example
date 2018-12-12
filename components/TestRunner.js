import * as R from 'ramda'
import { useReducer } from 'react'

import TestRunnerView from './TestRunnerView'

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

function handleStart(dispatch, tests) {
  return () => {
    dispatch({ type: 'suiteRunning' })
    tests.forEach(handleTestStart(dispatch))
  }
}

function handleTestStart(dispatch) {
  return test => {
    dispatch({ type: 'testRunning', test })
    test.run(result =>
      dispatch({ type: 'testFinished', test, didPass: result })
    )
  }
}

/*
  This function handles the stateful side of running tests, allowing the views to
  remain stateless.
*/
const TestRunner = ({ tests }) => {
  const [state, dispatch] = useReducer(reducer, {
    tests,
    started: false
  })

  return (
    <TestRunnerView
      tests={state.tests}
      started={state.started}
      handleStart={handleStart(dispatch, tests)}
    />
  )
}
export default TestRunner
