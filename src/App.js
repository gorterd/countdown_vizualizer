import './App.css';
import { useEffect, useState, useMemo } from 'react';

function FrameVizualizer() {
  const [frames, setFrames] = useState([]);
  const [outputContent, setOutputContent] = useState([]);

  function pushFrame(props) {
    const newFrame = <StackFrame {...props} {...callbacks} />
    setFrames( oldFrames => [newFrame, ...oldFrames]);
  }

  function output(text) {
    setOutputContent( oldOutput => [...oldOutput, text]);
  }

  function popFrame() {
    setFrames(oldFrames => oldFrames.slice(1));
  }

  const callbacks = { pushFrame, output, popFrame };

  useEffect(() => {
    if (frames.length === 0) {
      setTimeout(() => {
        setFrames([
          <StackFrame
            key={3}
            arg={3}
            resumePrev={() => setOutputContent([])}
            {...callbacks}
          />
        ]);
      }, 1500);
    }
  });

  return (
    <main>
      <section className="frames">
        {frames}
      </section>
      <section className="output">
        <h1>Console / Terminal</h1>
        <div className="console">
          {outputContent.map((text, idx) => <p key={idx}>{text}</p>)}
        </div>
      </section>
    </main>
  )
}

function StackFrame({ arg, resumePrev, pushFrame, output, popFrame }) {
  const [curLine, setCurLine] = useState(0);

  const evalLineFunctions = useMemo( () => {
    function switchLine(line) {
      setTimeout(() => setCurLine(line), 1600)
    }

    return (
      {
        0: () => {
          if (arg === 0) {
            switchLine(1)
          } else {
            switchLine(5)
          }
        },
        1: () => {
          output("lift off!");
          switchLine(2)
        },
        2: () => {
          setTimeout(popFrame, 1400);
        },
        5: () => {
          output(arg);
          switchLine(6)
        },
        6: () => {
          setTimeout( () => pushFrame({
            key: arg - 1,
            arg: arg - 1,
            resumePrev: () => switchLine(7)
          }), 1600);
        },
        7: () => {
          setTimeout(popFrame, 1400);
        }
      }
    );
  }, [arg, output, popFrame, pushFrame]);

  useEffect(() => {
    evalLineFunctions[curLine]();
  }, [curLine, evalLineFunctions])

  useEffect(() => () => resumePrev(), [resumePrev]);

  const arrow = (line) => <span>{curLine === line ? "=>" : "  "}</span>;

  return (
    <div className="frame" style={{width: 200 + (arg * 30)}}>
      <h1>countdown(<span>{arg}</span>)</h1>
      <pre>  def countdown(n)</pre>
      <pre>{arrow(0)}  if n == 0</pre>
      <pre>{arrow(1)}    p "lift off!"</pre>
      <pre>{arrow(2)}    return</pre>
      <pre>{arrow(3)}  end</pre>
      <pre className="small">{arrow(4)}</pre>
      <pre>{arrow(5)}  p n</pre>
      <pre>{arrow(6)}  countdown(n - 1)</pre>
      <pre>{arrow(7)}end</pre>
    </div>
  );
}

export default FrameVizualizer;
