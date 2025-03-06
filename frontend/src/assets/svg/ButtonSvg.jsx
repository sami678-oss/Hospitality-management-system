const ButtonSvg = (white) => (
    <>
      <svg
        className="absolute top-0 left-0"
        width="21"
        height="44"
        viewBox="0 0 21 44"
      >
        <path
          fill={white ? "white" : "none"}
          stroke={white ? "white" : "url(#btn-left)"} // mentioned in ButtonGradient.jsx
          strokeWidth="2"
          d="M21,43.00005 L8.11111,43.00005 C4.18375,43.00005 1,39.58105 1,35.36365 L1,8.63637 C1,4.41892 4.18375,1 8.11111,1 L21,1"
        />
      </svg>
      <svg
        className="absolute top-0 left-[1.3125rem] w-[calc(100%-2.625rem)]"
        height="44"
        viewBox="0 0 100 44"
        preserveAspectRatio="none"
        fill={white ? "white" : "none"}
      >
        {white ? (
          <polygon
            fill="white"
            fillRule="nonzero"
            points="100 0 100 44 0 44 0 0"
          />
        ) : (
          <>
            <polygon
              fill="url(#btn-top)" // mentioned in ButtonGradient.jsx
              fillRule="nonzero"
              points="100 42 100 44 0 44 0 42"
            />
            <polygon
              fill="url(#btn-bottom)" // mentioned in ButtonGradient.jsx
              fillRule="nonzero"
              points="100 0 100 2 0 2 0 0"
            />
          </>
        )}
      </svg>
      <svg
        className="absolute top-0 right-0"
        width="21"
        height="44"
        viewBox="0 0 21 44"
      >
        <path
          fill={white ? "white" : "none"}
          stroke={white ? "white" : "url(#btn-right)"} // mentioned in ButtonGradient.jsx
          strokeWidth="2"
          d="M0,43.00005 L5.028,43.00005 L12.24,43.00005 C16.526,43.00005 20,39.58105 20,35.36365 L20,16.85855 C20,14.59295 18.978,12.44425 17.209,10.99335 L7.187,2.77111 C5.792,1.62675 4.034,1 2.217,1 L0,1"
        />
      </svg>
    </>
  );
  
  export default ButtonSvg;




// const ButtonSvg = (white) => (
//   <>
//     <svg
//       className="absolute top-0 left-0"
//       width="120"
//       height="50"
//       viewBox="0 0 120 50"
//     >
//       <path
//         d="
//           M10 25
//           C10 10, 30 10, 30 25
//           C30 40, 10 40, 10 25
//           M90 25
//           C90 10, 110 10, 110 25
//           C110 40, 90 40, 90 25
//           M30 25
//           C30 10, 90 10, 90 25
//           C90 40, 30 40, 30 25
//         "
//         fill={white ? "white" : "none"}
//         stroke={white ? "white" : "url(#btn-goggles)"}
//         strokeWidth="2"
//       />
//       <defs>
//         <linearGradient id="btn-goggles" x1="0%" y1="0%" x2="100%" y2="0%">
//           <stop offset="0%" style={{ stopColor: "#4CAF50", stopOpacity: 1 }} />
//           <stop offset="100%" style={{ stopColor: "#1976D2", stopOpacity: 1 }} />
//         </linearGradient>
//       </defs>
//     </svg>
//   </>
// );

// export default ButtonSvg;


// const ButtonSvg = (white) => (
//     <>
//       <svg
//         className="absolute top-0 left-0"
//         width="150"
//         height="60"
//         viewBox="0 0 150 60"
//       >
//         <path
//           d="
//             M10 30
//             C10 10, 40 5, 75 5
//             C110 5, 140 10, 140 30
//             C140 50, 110 55, 75 55
//             C40 55, 10 50, 10 30
//             M30 30
//             C30 20, 50 20, 50 30
//             C50 40, 30 40, 30 30
//             M100 30
//             C100 20, 120 20, 120 30
//             C120 40, 100 40, 100 30
//           "
//           fill={white ? "white" : "none"}
//           stroke={white ? "white" : "url(#btn-vr-headset)"}
//           strokeWidth="2"
//         />
//         <defs>
//           <linearGradient id="btn-vr-headset" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" style={{ stopColor: "#4CAF50", stopOpacity: 1 }} />
//             <stop offset="100%" style={{ stopColor: "#1976D2", stopOpacity: 1 }} />
//           </linearGradient>
//         </defs>
//       </svg>
//     </>
//   );
  
//   export default ButtonSvg;
  

