import React from 'react';
import PropTypes from 'prop-types';
import "./Section.scss";

export default class Section extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      folded: false
    }
  }

  render() {
    return (
      <div className="section">
        <div
          className="header-wrapper"
          onClick={() => {
            if (this.props.foldable) {
              this.setState({ folded: !this.state.folded })
            }
          }}
        >
          <div className="title">{this.props.title}</div>
          {this.props.foldable && (
            <div className={this.state.folded ? "toggle-folded activated" : "toggle-folded"}>✚</div>
          )}
        </div>
        {!this.state.folded && (
          <div className="content">{this.props.children}</div>
        )}
      </div>



    )
  }
}
