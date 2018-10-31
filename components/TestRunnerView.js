import * as R from 'ramda'

import Test from './Test'

const isPassed = R.propEq('status', 'Passed')
const isFailed = R.propEq('status', 'Failed')
const isRunning = R.propEq('status', 'Running')

const SortedTests = ({ tests }) =>
  tests.map(test => <Test {...test} key={test.description} />)

const TestRunnerView = ({ tests, handleStart, started }) => {
  const passed = R.filter(isPassed, tests)
  const failed = R.filter(isFailed, tests)
  const running = R.filter(isRunning, tests)

  return (
    <div>
      <SortedTests tests={tests} />
      {started ? (
        <div>
          <div>Passed: {passed.length}</div>
          <div>Failed: {failed.length}</div>
          <div>Still running: {running.length}</div>
          {running.length === 0 && <div> FINISHED!</div>}
        </div>
      ) : (
        <button onClick={handleStart}>Start Tests</button>
      )}
    </div>
  )
}

export default TestRunnerView
