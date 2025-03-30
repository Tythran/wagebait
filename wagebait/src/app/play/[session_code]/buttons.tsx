import ActionButton from './buttons.action';
import AnswerButton from './buttons.answer';
import Money from './buttons.money';
import ButtonRow from './buttons.row';

export default function Buttons({ name }: { name: string }) {
  return (
    <div className="d-flex flex-column gap-3" style={{ height: '100%' }}>
      <div className="row">
        <span
          style={{
            fontSize: '3rem',
            lineHeight: '3.2rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </span>
      </div>
      <ButtonRow flexGrow={3}>
        <AnswerButton color="success">
          <i className="bi bi-square" />
        </AnswerButton>
        <AnswerButton color="danger">
          <i className="bi bi-circle" />
        </AnswerButton>
      </ButtonRow>
      <ButtonRow flexGrow={3}>
        <AnswerButton color="warning">
          <i className="bi bi-triangle" />
        </AnswerButton>
        <AnswerButton color="info">
          <i className="bi bi-diamond" />
        </AnswerButton>
      </ButtonRow>
      <ButtonRow flexGrow={2}>
        <ActionButton>Call</ActionButton>
        <ActionButton>Bet</ActionButton>
        <ActionButton>Fold</ActionButton>
      </ButtonRow>
      <div className="row">
        <Money name="Bet" amount={121} />
        <Money name="Balance" amount={129383} />
      </div>
    </div>
  );
}
