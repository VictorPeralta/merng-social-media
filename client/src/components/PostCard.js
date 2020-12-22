import react from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
function PostCard({
  post: { body, createdAt, id, username, likes, comments },
}) {
  function likePost() {
    console.log("Liked post");
  }
  function commentPost() {
    console.log("Comment post");
  }
  return (
    <Card>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="http://placecorgi.com/600/600"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {new Date(createdAt).toDateString()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button as="div" labelPosition="right" onClick={likePost}>
          <Button basic color="teal">
            <Icon name="heart" />
          </Button>
          <Label basic color="teal" pointing="left">
            {likes.length}
          </Label>
        </Button>
        <Button as="div" labelPosition="right" onClick={commentPost}>
          <Button basic color="blue">
            <Icon name="comments" />
          </Button>
          <Label basic color="blue" pointing="left">
            {comments.length}
          </Label>
        </Button>
      </Card.Content>
    </Card>
  );
}

export default PostCard;
