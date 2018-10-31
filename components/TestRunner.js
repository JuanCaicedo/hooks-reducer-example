import * as R from 'ramda'
import { useState } from 'react'

import TestRunnerView from './TestRunnerView'

const setStatus = (test, status) => {
  if (status === true) {
    return R.merge(test, { status: 'Passed' })
  } else if (status === false) {
    return R.merge(test, { status: 'Failed' })
  }
  return R.merge(test, { status })
}

/*
  This class handles the stateful side of running tests, allowing the views to
  remain stateless.
 */
const TestRunner = ({ tests: _tests }) => {
  const [tests, setTests] = useState(_tests)
  const [started, setStarted] = useState(false)

  const handleStart = () => {
    setStarted(true)
    setTests(tests.map(test => setStatus(test, 'Running')))
    tests.forEach(test =>
      test.run(result =>
        handleFinished({ result, description: test.description })
      )
    )
  }

  const handleFinished = ({ result, description }) => {
    const index = R.findIndex(R.whereEq({ description }))(tests)
    const finishedTest = setStatus(tests[index], result)
    const updatedTests = R.update(index, finishedTest, tests)
    setTests(updatedTests)
  }
  return (
    <TestRunnerView tests={tests} started={started} handleStart={handleStart} />
  )
}
export default TestRunner
