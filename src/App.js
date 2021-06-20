import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  //Обьекты с информацией о фотографиях
  const [photos, setPhotos] = useState([]);
  //хранит в себе номер текущей страници
  const [currentPage, setCurrentPage] = useState([]);
  //принимает true когда подгружаем данные
  const [fetching, setFetching] = useState(true);

  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (fetching) {
      axios
        .get(
          ` https://jsonplaceholder.typicode.com/photos?_limit=20&_page=${currentPage}`
        )
        //получаем результат запроса
        .then((response) => {
          //из запроса приходят фотографии, обновляем соостояние и добавляем туда полученные фотографии
          setPhotos([...photos, ...response.data]);
          setCurrentPage((prevState) => prevState + 1);
          setTotalCount(response.headers["x-total-count"]);
        })
        .finally(() => setFetching(false));
    }
  }, [fetching]);

  //Внутри колбэка повесим слушатель 'scroll' на документ
  useEffect(() => {
    document.addEventListener("scroll", scrollHeight);

    return function () {
      // удаляем слушатель
      document.removeEventListener("scroll", scrollHeight);
    };
  }, [fetching]);
  //Ф-я которая будет вызываться при скроле страници
  const scrollHeight = (e) => {
    if (
      // e.target.documentElement.scrollHandler - общая высота страници с учётом скрола
      // e.target.documentElement.scrollTop - текущее положение скрола от верха страници
      // window.innerHandler - высота видимой области страници
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) <
      100  && photos.length < totalCount) {
      setFetching(true);
    }
  };
  return (
    <div className={"app"}>
      {photos.map((photo) => (
        <div className="photo" key={photo.id}>
          <div className="title">
            {photo.id} {photo.title}
          </div>
          <img src={photo.thumbnailUrl} alt="" />
        </div>
      ))}
    </div>
  );
}

export default App;
