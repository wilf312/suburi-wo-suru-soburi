import { useEffect, useState } from "preact/hooks";

// // キーの検索
// const result = await kv.get(["key"]);

export default function Chat() {
  const [list, setList] = useState([]);

  const [text, setText] = useState(``);
  const [name, setName] = useState(localStorage.getItem(`name`) || ``);
  useEffect(() => {
    fetch("/api/chat", {
      method: "get",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => res.json()).then((d) => {
      console.log({ data: d.list });

      setList(d.list.map((d) => {
        return { text: d.value, name: d.key[1], date: new Date(d.key[2]) };
      }));
    }).catch(console.error);
  }, []);

  return (
    <div>
      <ul>
        {list.map((d) => {
          return (
            <li
              style={{
                fontSize: `18px`,
              }}
            >
              {d.name}: {d.text} {d.date.toISOString()}
            </li>
          );
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
          const data = {
            text,
            date: new Date(),
            name: name,
          };
          setList([
            data,
            ...list,
          ]);
          setText(``);

          fetch("/api/chat", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text, name }),
          }).then((res) => res.json()).then(console.log).catch(console.error);
        }}
      >
        <input
          max={50}
          style={{
            fontSize: `30px`,
          }}
          placeholder={`名前`}
          type="text"
          value={name}
          onInput={(e) => {
            const _name = e.currentTarget.value ?? ``;
            setName(_name);
            localStorage.setItem(`name`, _name);
          }}
        />
        <input
          max={50}
          style={{
            fontSize: `30px`,
          }}
          placeholder={`入力してください`}
          type="text"
          value={text}
          onInput={(e) => setText(e.currentTarget.value ?? ``)}
        />
        <button
          style={{
            fontSize: `50px`,
          }}
          type="submit"
        >
          send
        </button>
      </form>

      <button
        style={{
          border: `none`,
          background: `none`,
          color: `white`,
        }}
        type="button"
        onClick={() => {
          fetch("/api/chat", {
            method: "delete",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ secret: `test` }),
          }).then((res) => res.json()).then(console.log).catch(console.error);
        }}
      >
        全てを消す
      </button>
    </div>
  );
}
