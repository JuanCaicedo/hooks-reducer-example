import * as R from 'ramda'

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
class TestRunner extends React.Component {
  state = {
    tests: this.props.tests
  }

  handleStart = () => {
    this.setState({
      tests: this.state.tests.map(test => setStatus(test, 'Running')),
      started: true
    })
    this.state.tests.forEach(test =>
      test.run(result => this.handleFinished(result, test.description))
    )
  }

  handleFinished = (result, description) => {
    const index = R.findIndex(R.propEq('description', description))(
      this.state.tests
    )
    const finishedTest = setStatus(this.state.tests[index], result)
    const updatedTests = R.update(index, finishedTest, this.state.tests)
    this.setState({ tests: updatedTests })
  }

  render() {
    return (
      <TestRunnerView
        tests={this.state.tests}
        started={this.state.started}
        handleStart={this.handleStart}
      />
    )
  }
}
export default TestRunner
