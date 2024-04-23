import { signal, useSignal } from "@preact/signals";
import "./style.css";

type BookInfo = {
  isbn: string;
  title: string;
  imageURL: string;
  author: string;
  publisher: string;
  publishedDate: string;
};

export function Home() {
  const isbn = useSignal<string>("9788580575958");
  const bookInfo = useSignal<BookInfo | undefined>(undefined);

  const searchBook = async () => {
		console.log(isbn.value);
		
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://isbnsearch.org/isbn/${isbn.value}`
    )}`;
    const result = await fetch(url).then((x) => x.json() as unknown as {
			contents: string
		});

    const tree = document.createElement("div");
    tree.innerHTML = result.contents;

    bookInfo.value = {
      isbn: isbn.value,
      title: tree.querySelector("#page #book .bookinfo h1").textContent,
      imageURL: (
        tree.querySelector("#page #book .image img") as HTMLImageElement
      ).src,
      author: tree.querySelector("#book > div.bookinfo > p:nth-child(4)")
        .textContent.replace('Author: ', ''),
      publisher: tree.querySelector("#book > div.bookinfo > p:nth-child(7)")
        .textContent.replace('Publisher: ', ''),
      publishedDate: tree.querySelector("#book > div.bookinfo > p:nth-child(8)")
        .textContent.replace('Published: ', ''),
    };
  };

	const onInput = (event) => {
		isbn.value = event.currentTarget.value;
	};

  return (
    <div>
      <input value={isbn.value} onInput={onInput} />

      <button onClick={searchBook}>Search</button>

			<br />

      {bookInfo.value && (
				<>
					<img src={bookInfo.value.imageURL} alt={bookInfo.value.title} />
					<h1>{bookInfo.value.title}</h1>
					<p>Autor: {bookInfo.value.author}</p>
					<p>Ano: {bookInfo.value.publishedDate}</p>
					<p>Publisher: {bookInfo.value.publisher}</p>
				</>
			)}
    </div>
  );
}
