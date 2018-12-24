using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using CapstoneProject.Data;

namespace CapstoneProject.Controllers
{
    public class CirclesController : Controller
    {
        private DataModel db = new DataModel();

        // GET: Circles
        public ActionResult Index()
        {
            var circles = db.Circles.Include(c => c.Map);
            return View(circles.ToList());
        }

        //GET: Circle/MapId
        public ActionResult MapId([Bind(Prefix ="id")]int mapId)
        {
            var map = db.Maps.Find(mapId);
            if(map != null)
            {
                return View(map);
            }
            return HttpNotFound();

        }

        public ActionResult GetCircleJson([Bind(Prefix = "id")]int mapId)
        {
            var map = db.Maps.Find(mapId);
           var circles = db.Circles.Include(c => map);
           return Json(circles, JsonRequestBehavior.AllowGet);
            
           
        }

        // GET: Circles/Details/
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Circle circle = db.Circles.Find(id);
            if (circle == null)
            {
                return HttpNotFound();
            }
            return View(circle);
        }

        // GET: Circles/Create
        [HttpGet]
        public ActionResult Create()
        {
            ViewBag.MapId = new SelectList(db.Maps, "Id", "Name");
            return View();
        }

        // POST: Circles/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        //public ActionResult Create(Circle circle)
        //{
                
        //        return RedirectToAction("Create","Home",circle);

        //    //ViewBag.MapId = new SelectList(db.Maps, "Id", "Name", circle.MapId);
        //    //return View("~/Views/Home/EditMapView.cshtml");
        //}

        // GET: Circles/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Circle circle = db.Circles.Find(id);
            if (circle == null)
            {
                return HttpNotFound();
            }
            ViewBag.MapId = new SelectList(db.Maps, "Id", "Name", circle.MapId);
            return View(circle);
        }

        // POST: Circles/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public ActionResult Edit([Bind(Include = "Id,Lat,Lng,Radius,StartDate,EndDate,Description,MapId")] Circle circle)
        {
            if (ModelState.IsValid)
            {
                db.Entry(circle).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.MapId = new SelectList(db.Maps, "Id", "Name", circle.MapId);
            return View("~/Views/Home/EditMapView.cshtml");
        }

        // GET: Circles/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Circle circle = db.Circles.Find(id);
            if (circle == null)
            {
                return HttpNotFound();
            }
            return View(circle);
        }

        // POST: Circles/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Circle circle = db.Circles.Find(id);
            db.Circles.Remove(circle);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
