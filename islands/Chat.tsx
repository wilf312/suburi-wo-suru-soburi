import { useState } from "preact/hooks";

export default function Chat() {
  const [list, setList] = useState([
    {
      date: new Date(),
      text: `text`,
      name: `aaaa`,
    },
    {
      date: new Date(),
      text: `text`,
      name: `bbbb`,
    },
    {
      date: new Date(),
      text: `text`,
      name: `cccc`,
    },
  ]);

  const [text, setText] = useState(``);
  const [name, setName] = useState(``);

  return (
    <div>
      <ul>
        {list.map((d) => {
          return <li>{d.name}: {d.text} {d.date.toISOString()}</li>;
        })}
      </ul>
      <form
        style={{
          position: `fixed`,
          bottom: 0,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!text || !name) {
            return;
          }
          setList([
            {
              text,
              date: new Date(),
              name: name,
            },
            ...list,
          ]);
          setText(``);
        }}
      >
        <input
          type="text"
          value={name}
          onInput={(e) => setName(e.currentTarget.value ?? ``)}
        />
        <input
          type="text"
          value={text}
          onInput={(e) => setText(e.currentTarget.value ?? ``)}
        />
        <button type="submit">send</button>
      </form>
    </div>
  );
}
