function DashboardCards() {

  const stats = [
    { title: "Total Categories", value: 12, color: "primary" },
    { title: "Total Services", value: 48, color: "success" },
    { title: "Providers", value: 36, color: "warning" },
    { title: "Users", value: 120, color: "danger" }
  ];

  return (
    <div className="row g-4">

      {stats.map((item, index) => (

        <div key={index} className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0">

            <div className="card-body">

              <h6 className="text-muted">
                {item.title}
              </h6>

              {/* FIXED */}
              <h3 className={`fw-bold text-${item.color}`}>
                {item.value}
              </h3>

            </div>

          </div>

        </div>

      ))}

    </div>
  );
}

export default DashboardCards;