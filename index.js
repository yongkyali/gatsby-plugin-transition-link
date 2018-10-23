import React, { Component } from "react";
import { Link, navigate } from "gatsby";
import { Location } from "@reach/router";
import { Consumer } from "./store/createContext";

export default class TransitionLink extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event, timeout, updateExitTimeout, updateDelayNext, hideNextFor) {
    event.preventDefault();

    updateExitTimeout(timeout);
    updateDelayNext(hideNextFor);

    this.props.triggerFn(timeout);

    navigate(this.props.to, {
      state: this.props.nextState
    });

    setTimeout(() => updateExitTimeout(0), timeout);
    setTimeout(() => updateDelayNext(0), hideNextFor);
  }

  render() {
    const {
      props: { to, children }
    } = this;

    return to && children ? (
      <Consumer>
        {({ updateExitTimeout, updateDelayNext }) => (
          <Link
            onClick={e =>
              this.handleClick(
                e,
                this.props.exitAnimationTimeout,
                updateExitTimeout,
                updateDelayNext,
                this.props.hideNextFor
              )
            }
            to={this.props.to}
          >
            {this.props.children}
          </Link>
        )}
      </Consumer>
    ) : null;
  }
}

export class TransitionState extends Component {
  render() {
    return (
      <Location>
        {({ location }) => {
          const childrenWithProps = React.Children.map(
            this.props.children,
            child =>
              React.cloneElement(child, { transitionState: location.state })
          );
          return childrenWithProps;
        }}
      </Location>
    );
  }
}
