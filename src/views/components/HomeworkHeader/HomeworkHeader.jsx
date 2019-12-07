import React from 'react';
import "./HomeworkHeader.scss";

export default class HomeworkHeader extends React.Component {
  render() {
    return (
      <div className="homework-header">
        <div className="hh-subheader hh-left">
          <div class="hh-strong">{this.props.studentName}</div>
          <div class="hh-strong">{this.props.course}</div>
          <div class="hh-thin">Due:&nbsp;<div class="hh-strong">{this.props.dueDate}</div></div>
        </div>
        <div className="hh-subheader hh-middle">
          <div class="hh-title">{this.props.title}</div>
          <div class="hh-subtitle">{this.props.subtitle}</div>
        </div>
        <div className="hh-subheader hh-right">
          <div class="hh-thin">Prof.&nbsp;<div class="hh-strong">{this.props.prof}</div></div>
          {this.props.ta &&
            <div class="hh-thin">TA:&nbsp;<div class="hh-strong">{this.props.ta}</div></div>
          }
          <div class="hh-thin">CRN:&nbsp;<div class="hh-strong">{this.props.crn}</div></div>
        </div>
      </div>

    )
  }
}