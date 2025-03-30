export default function BetModal() {
  return (
    <div className="modal" id="betModal" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            <form>
              <input type="numeric" className="form-control" placeholder="Enter bet amount" />
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" className="btn btn-primary">
              Place bet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
