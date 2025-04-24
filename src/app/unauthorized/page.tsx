export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen gap-12 py-8">
      <svg
        className="h-[50vh] aspect-video"
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <g id="freepik--background-simple--inject-3">
          <path
            d="M55.48,273.73s2.32,72,62.43,120,143.41,51.43,210.84,56,119.23-33.62,127-91.32-43.72-74.64-71.68-140.33S358.64,130.8,299.49,90.4,147.8,74.81,99.29,144,55.48,273.73,55.48,273.73Z"
            style={{ fill: "#3B82F6" }}
          />
          <path
            d="M55.48,273.73s2.32,72,62.43,120,143.41,51.43,210.84,56,119.23-33.62,127-91.32-43.72-74.64-71.68-140.33S358.64,130.8,299.49,90.4,147.8,74.81,99.29,144,55.48,273.73,55.48,273.73Z"
            style={{ fill: "#fff", opacity: 0.7 }}
          />
        </g>
        <g id="freepik--Text--inject-3">
          <path
            d="M350,128.81V131h-5.33v7.76h6.55V141h-9v-21.8h9v2.21h-6.55v7.44Z"
            style={{ fill: "#263238" }}
          />
          <path
            d="M358.3,119.16c3.42,0,4.86,1.74,4.86,5v1.78c0,2.4-.84,3.89-2.71,4.48,2,.59,2.74,2.21,2.74,4.55v3.4a5.49,5.49,0,0,0,.43,2.61h-2.46a5.7,5.7,0,0,1-.4-2.64v-3.43c0-2.46-1.15-3.24-3.18-3.24h-1.71V141h-2.43v-21.8Zm-.63,10.28c1.94,0,3.09-.63,3.09-3v-2.09c0-2-.72-3-2.52-3h-2.37v8.07Z"
            style={{ fill: "#263238" }}
          />
        </g>
      </svg>

      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold">You are not authorized</h1>
        <p className="text-xl">
          You tried to access a page you did not have prior authorization for.
        </p>
      </div>
    </div>
    );
  }
  