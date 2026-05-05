"use client";

import { useState } from "react";
import { getHello } from "../api";

export default function Home() {
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    const res = await getHello();
    setMessage(res.data.message);
  };

  return (
    <div>
      <button onClick={fetchData}>取得</button>
      <p>{message}</p>
    </div>
  );
}
