import React, { useState } from "react";

export default function Tags({ categories, activeButton, onCategorySelect }) {
  return (
    <>
      {categories.map((category) => {
        return (
            <button
              key={category.id}
              className={
                activeButton === category.id
                  ? "btn btn-success"
                  : "btn btn-secondary"
              }
              onClick={() => onCategorySelect(category.id)}
            >
              {category.name}
            </button>
        );
      })}
    </>
  );
}