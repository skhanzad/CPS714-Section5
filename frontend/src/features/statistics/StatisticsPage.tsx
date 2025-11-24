import DailyCheckouts from "./DailyCheckouts";
import PopularItems from "./PopularItems";
import NewRegistrations from "./NewRegistrations";
export default function StatisticsPage() {
  return (
  
    <div style={{
        minHeight: "100vh", //vh means 100 of the screens height, makin sure that it fills entire screen vertically
        display: "flex",           //put in the Fbox
        padding: "50px 500px", 
      
      }}>

        <div style={{
          width: "100%",          
          padding: "0 16px",
        }}>
            
      <h1 style={{ textAlign: "center" }}>Statistics Dashboard</h1>

      <section
        style={{
          display: "grid",
            gap: "24px",
            marginTop: "24px",
         
           
        }}
      >
        <h2  style={{ textAlign: "center" }}>Amount checked out this week</h2>
        <DailyCheckouts />
        <h3  style={{ textAlign: "center" }}>Most Popular Items this week!</h3>
        <PopularItems />
      </section>

      {/* Table section – placeholder for now */}
      <section style={{ marginTop: "32px" }}>
        <h2 style={{ textAlign: "center" }}>New Registrations</h2>
         <NewRegistrations/>
      </section>
    </div>
    </div>
  );
}