import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red, pink } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

type CompletedCardProps = {
  id: string;
  user: string;
  task_type: string;
  prompt: string;
  fee: string;
  fee_unit: string;
  created_at?: any;
  unique_id?: string;
  solution?: string;
  solver_type?: string;
};

function CompletedCard(card: CompletedCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        // maxWidth: 350,
        maxWidth: {
          xs: 350,
          md: 400,
          lg: 400,
          xl: 400,
        },
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: pink[300] }} aria-label="recipe">
            {card.task_type}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`ID: ${card.id}`}
        subheader={
          <>
            <p>{new Date(card.created_at).toLocaleDateString()}</p>
            <div className="w-[12px] h-[12px] bg-green-500 rounded-full inline-block"></div>
            <span style={{ fontSize: 12 }} className="t pl-1">
              Resolved task
            </span>
          </>
        }
      />

      {card.solution?.startsWith("data:image/png") ||
      card.solution?.startsWith("https://p.ipic.vip") ? (
        <CardMedia
          component="img"
          height="194"
          image={card.solution}
          alt="Paella dish"
        />
      ) : (
        <Typography
          variant="body2"
          sx={{ fontSize: 14, padding: 2, mt: 1, color: "text.primary" }}
        >
          Solution: {card.solution}
        </Typography>
      )}

      <CardContent>
        <Typography
          variant="body2"
          sx={{ minHeight: 48, fontSize: 16, color: "text.secondary" }}
        >
          Task: {card.prompt}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: 14, mt: 1, color: "text.secondary" }}
        >
          {card?.user?.slice(0, 6)}...{card?.user?.slice(-4)}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: 12, mt: 1, color: pink[300] }}
        >
          Fee: {card.fee} {card.fee_unit}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            ID:{card.id}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            User: {card?.user?.slice(0, 6) + "..." + card?.user?.slice(-4)}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Task Type: {card.task_type}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Prompt: {card.prompt}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Fee: {card.fee} {card.fee_unit}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Created At: {new Date(card.created_at).toLocaleDateString()}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Unique ID: {card.unique_id}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Solution: {card.solution}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Solver Type: {card.solver_type}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

type AgentCardProps = {
  id: string;
  description: string;
  type: string;
  addr: string;
  owner_addr: string;
  source_url: string;
  solved_times?: string;
  created_at?: any;
  unique_id?: string;
};

function AIAgentCard(agent: AgentCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: pink[300] }} aria-label="recipe">
            {agent.type}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`ID: ${agent.id}`}
        subheader={
          <>
            <p>{new Date(agent.created_at).toLocaleDateString()}</p>
            <div className="w-[12px] h-[12px] bg-sky-600 rounded-full inline-block"></div>
            <span style={{ fontSize: 12 }} className="t pl-1">
              AI agent
            </span>
          </>
        }
      />
      <CardContent>
        <Typography
          variant="body2"
          sx={{ minHeight: 70, fontSize: 16, color: "text.secondary" }}
        >
          <span className="truncate-2-lines">
            Description: {agent.description}
          </span>
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: 12, mt: 1, color: "text.secondary" }}
        >
          Address: {agent?.addr?.slice(0, 6)}...{agent?.addr?.slice(-4)}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: 12, color: "text.secondary" }}
        >
          Owner: {agent?.owner_addr?.slice(0, 6)}...
          {agent?.owner_addr?.slice(-4)}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 12, color: pink[300] }}>
          Solved Times:{agent.solved_times}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            ID:{agent.id}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            {/* User: {agent.user.slice(0, 6) + "..." + agent.user.slice(-4)} */}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Description: {agent.description}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Type: {agent.type}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: 12, mt: 1, color: "text.secondary" }}
          >
            Address: {agent?.addr?.slice(0, 6)}...{agent?.addr?.slice(-4)}
            <button
              onClick={() => navigator.clipboard.writeText(agent.addr)}
              className="ml-2 text-blue-500 hover:underline"
            >
              Copy
            </button>
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: 12, color: "text.secondary" }}
          >
            Owner: {agent?.owner_addr?.slice(0, 6)}...
            {agent?.owner_addr?.slice(-4)}
            <button
              onClick={() => navigator.clipboard.writeText(agent.owner_addr)}
              className="ml-2 text-blue-500 hover:underline"
            >
              Copy
            </button>
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Source: {agent.source_url}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Solved Times: {agent.solved_times}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Created At: {agent.created_at}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Unique ID: {agent.unique_id}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

type CardProps = {
  id: string;
  user: string;
  task_type: string;
  prompt: string;
  fee: string;
  fee_unit: string;
  created_at?: any;
  unique_id?: string;
  solution?: string;
  solver_type?: string;
};

function PendingCard(card: CardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: pink[300] }} aria-label="recipe">
            {card.task_type}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`ID: ${card.id}`}
        subheader={
          <>
            <p>{new Date(card.created_at).toLocaleDateString()}</p>
            <div className="w-[12px] h-[12px] bg-rose-500 rounded-full inline-block"></div>
            <span style={{ fontSize: 12 }} className="t pl-1">
              Unsolved task
            </span>
          </>
        }
      />
      <CardContent>
        <Typography
          variant="body2"
          sx={{ minHeight: 48, fontSize: 16, color: "text.secondary" }}
        >
          Task: {card.prompt}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: 14, mt: 1, color: "text.secondary" }}
        >
          {card.user.slice(0, 6)}...{card.user.slice(-4)}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: 12, mt: 1, color: pink[300] }}
        >
          Fee: {card.fee} {card.fee_unit}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            ID:{card.id}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            User: {card.user.slice(0, 6) + "..." + card.user.slice(-4)}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Task Type: {card.task_type}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Prompt: {card.prompt}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Fee: {card.fee} {card.fee_unit}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Created At: {new Date(card.created_at).toLocaleDateString()}
          </Typography>
          <Typography
            sx={{ marginBottom: 1, color: "text.secondary", fontSize: 14 }}
          >
            Unique ID: {card.unique_id}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export { PendingCard, AIAgentCard, CompletedCard };
