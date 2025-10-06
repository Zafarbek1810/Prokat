import React from 'react';
import Link from "next/link";

const MyLink = ({to, children, className, ...rest}) => {
  const classes = ["my-default-link"]
  if(className) {
    classes.push(className);
  }

  return (
    <Link href={to} legacyBehavior>
      <a className={classes.join(" ")} {...rest}>{children}</a>
    </Link>
  );
};

export default MyLink;
