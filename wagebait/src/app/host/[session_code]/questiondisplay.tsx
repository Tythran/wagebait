const optionStyles = [
  { icon: 'bi-square-fill', color: 'bg-green-500' },
  { icon: 'bi-circle-fill', color: 'bg-yellow-400' },
  { icon: 'bi-triangle-fill', color: 'bg-red-500' },
  { icon: 'bi-diamond-fill', color: 'bg-blue-500' },
];

export default function QuestionDisplay({
  questionText,
  questionOptions,
}: {
  questionText: string;
  questionOptions: string[];
}) {
  {
    return (
      <>
        <div className="d-flex flex-column align-items-center justify-content-center text-white text-center px-3">
          <h2 className="fw-bold display-6 mb-5">{questionText}</h2>

          <div className="container">
            <div className="row g-4">
              {questionOptions.map((opt, i) => {
                const { icon, color } = optionStyles[i];
                return (
                  <div key={i} className="col-6">
                    <div
                      className={`d-flex align-items-center gap-3 p-4 rounded-4 shadow ${color} hover-shadow transition`}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className={`bi ${icon} fs-3`}></i>
                      <span className="fs-5 fw-semibold">{opt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
}
