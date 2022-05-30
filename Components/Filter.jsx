import React, { useState, useEffect } from "react";
import FilterSearch from "../utils/filterSearch";
import { getData } from "../utils/fetchData";
import { useRouter } from "next/router";
import filterSearch from "../utils/filterSearch";

const Filter = ({ state }) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");

  const { categories } = state;
  const router = useRouter();
  const handleCategory = (e) => {
    setCategory(e.target.value);
    filterSearch({ router, category: e.target.value });
  };
  const handleSort = (e) => {
    setSort(e.target.value);
    filterSearch({ router, sort: e.target.value });
  };
  useEffect(() => {
    filterSearch({ router, search: search ? search : "all" });
  }, [search]);
  return (
    <div className="input-group">
      <div className="input-group-prepend col-md-2 px-0 mt-2">
        <select
          className="custom-select text-capitalize"
          value={category}
          onChange={handleCategory}
        >
          <option value="all">All products</option>
          {categories.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <form className="mt-2 col-md-8 px-0" autoComplete="off">
        <input
          type="text"
          className="form-control"
          list="title_product"
          value={search.toLowerCase()}
          onChange={(e) => setSearch(e.target.value)}
        />

      </form>
      <div className="input-group-prepend col-md-2 px-0 mt-2">
        <select
          className="custom-select text-capitalize"
          value={sort}
          onChange={handleSort}
        >
          <option value="-createdAt">Hàng mới nhất</option>
          <option value="oldest">Hàng cũ nhất</option>
          <option value="-sold">Hàng bán chạy nhất</option>
          <option value="-price">Giá giảm dần</option>
          <option value="price">Giá tăng dần</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
