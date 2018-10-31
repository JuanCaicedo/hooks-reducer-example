const Test = ({ description, status = 'Not Started Yet' }) => (
  <div>
    <div> Description: {description}</div>
    <div> Status: {status}</div>
  </div>
)

export default Test
