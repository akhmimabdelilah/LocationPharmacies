import Card from 'react-bootstrap/Card';


function Cards({data}) {
  return (
    <>
        { data.map((item) => {
            return(
                <Card key={item._id} style={{ width: '18rem', margin: '5px' }}>
                    <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{item.garde}</Card.Subtitle>
                        <Card.Text>
                            {item.address}
                        </Card.Text>
                        {/* <Card.Link href="#">Card Link</Card.Link>
                        <Card.Link href="#">Another Link</Card.Link> */}
                    </Card.Body>
                </Card>
            )
        })}
    </>
  );
}

export default Cards;