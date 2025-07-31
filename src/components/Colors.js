import React, { useEffect, useRef } from "react";
import { useGlobalContext } from "../context/context";

const COLORS = [
  "#B22222", "#483D8B", "#556B2F", "#8B5F65", "#3B5998",
  "#B8860B", "#8B7500", "#4682B4", "#2E8B57",
];

const Colors = () => {
    const { location, isColorsOpen, updateTaskColor, setIsColorsOpen } = useGlobalContext();
    const colorsRef = useRef(null);
  
    useEffect(() => {
      if (!colorsRef.current || !isColorsOpen) return;
      
      const { top, right } = location;
      const elementWidth = colorsRef.current.offsetWidth;
      colorsRef.current.style.left = `${right - elementWidth / 2}px`;
      colorsRef.current.style.top = `${top + 5}px`;
  
      const handleOutsideClick = (e) => {
          if (colorsRef.current && !colorsRef.current.contains(e.target) && !e.target.closest('.btn-colors')) {
              setIsColorsOpen(false);
          }
      };
      
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
  
    }, [location, isColorsOpen, setIsColorsOpen]);
  
    const handleColorClick = (color) => {
      updateTaskColor(location.id, color);
    };
  
    if (!isColorsOpen) return null;
  
    return (
      <div 
          ref={colorsRef}
          className="color-container" 
      >
        {COLORS.map((color, index) => (
          <div
            key={index}
            className="color-option"
            style={{ backgroundColor: color }}
            onClick={() => handleColorClick(color)}
          ></div>
        ))}
      </div>
    );
};
  
export default Colors;
