import React from 'react';
import "./Code.scss";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';


export default class Code extends React.Component {
  constructor(props) {
    super(props);

    //convert children to a string and strip off excess whitespace
    let lines = ("" + this.props.children).split("\n");

    let nWhitespaces = 0;
    if (lines[0].length > 1) {
      nWhitespaces = lines[0].search(/\S/);
    } else {
      nWhitespaces = lines[1].search(/\S/);
    }

    let code = "";
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]) {
        code += lines[i].slice(nWhitespaces) + "\n";
      }
    }
    code = code.slice(0, code.length - 1); //remove trailing \n

    this.state = {
      code
    }

    //load code from src if available
    if (this.props.src) {
      fetch(this.props.src).then((r) => r.text()).then((text) => {
        //trim any excess leading whitespace
        //for example, the string "  if(value){\n    do something\n  }" becomes:
        //if(value){\n  do something\n}
        let lines = ("" + text).split("\n");

        //slice up the input into this.props.width sized lines
        let tempCode = "";
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].length > 0) {
            let nTabsToStrip = lines[i].search(/\S/);
            for (let j = i; j < lines.length; j++) {
              let stripped = lines[j].slice(nTabsToStrip);

              if (this.props.width) {
                while (stripped.length > 0) {
                  if (stripped.length > this.props.width) {
                    tempCode += stripped.slice(0, this.props.width) + "\n"
                    stripped = stripped.slice(this.props.width);
                  } else {
                    tempCode += stripped;
                    stripped = "";
                  }
                }
              } else {
                tempCode += stripped;
              }
              tempCode += "\n";
            }

            break;
          }
        }


        this.setState({ code: tempCode });
      })

    }

  }
  render() {
    let classes = "code " + (this.props.inline ? "inline" : "block");

    return (
      <div class={classes}>
        {this.props.title &&
          <div class="title">{this.props.title}</div>
        }
        <SyntaxHighlighter
          style={vs}
          language={this.props.lang || "text"}
          showLineNumbers={!this.props.inline}
        >
          {this.state.code}
        </SyntaxHighlighter>
      </div>


    )
  }
}