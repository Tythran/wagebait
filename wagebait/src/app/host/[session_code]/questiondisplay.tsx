const optionStyles = [
  { icon: 'bi-square', color: 'success' },
  { icon: 'bi-circle', color: 'danger' },
  { icon: 'bi-triangle', color: 'warning' },
  { icon: 'bi-diamond', color: 'info' },
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
                      className={`d-flex align-items-center gap-3 p-4 rounded-4 shadow text-bg-${color} bg-gradient`}
                    >
                      <i className={`bi ${icon} fs-1`}></i>
                      <span className="fs-4 fw-semibold">{opt}</span>
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
