import React from "react";

interface Props {
  text: string;
}

const Text: React.FC<Props> = ({ text }) => {
  return <p>{text}</p>;
};

export default Text;
