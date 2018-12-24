using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using CapstoneProject.Data;
using Newtonsoft.Json;

namespace CapstoneProject.Controllers
{
    //Actions are just public methods inside a controller
    public class HomeController : Controller
    {
        private DataModel db = new DataModel();
        public string userName { get; set; }
        public int userId { get; set; }
       
        public ActionResult Index(User user)
        {
            userId = user.Id;
            userName = user.UserName;
            var currentUser = db.Users.Find(user.Id);
            return View("~/Views/Home/ListMapView.cshtml", currentUser);
        }

        [HttpPost]
        public ActionResult CreateMap(int? Id, string name, string description)
        {
            var currentuser = db.Users.Find(Id);
            int id = currentuser.Id;
            Map myMap = new Map() { Name = name , Description = description};
            currentuser.Maps.Add(myMap);
            //db.Maps.Add(currentuser.Maps.Where(m => m.Name == name).FirstOrDefault());
            db.SaveChanges();

            myMap = currentuser.Maps.Where(p => p.Name == name).FirstOrDefault();
            string mapName = myMap.Id.ToString();

            return RedirectToAction("EditMapView", new { name = mapName });
            //return Action("~/Views/Home/EditMapView.cshtml", );
            //return RedirectToAction("EditMapView",myMap);
        }

        public ActionResult MapDetail( int mapId)
        {
            var myMap = db.Maps.Find(mapId);
            var mapJson = JsonConvert.SerializeObject(myMap);

            return Json(mapJson);
        }
        public ActionResult EditMapView(string name)
        {
            if(!(name == String.Empty))
            {
                var mapName = Server.HtmlEncode(name);
                var mapID = Convert.ToInt16(mapName);
                Map myMap = db.Maps.Find(mapID);
                //String myMapName = db.Maps.Where(m => m.Name == mapName).FirstOrDefault().Nameo
                return View(myMap);
            }

            var currentUser = Session["User"] as User;

            return View("~/Views/Home/ListMapView.cshtml", currentUser);
        }

        //[HttpPost]
        public JsonResult GetMapAjax(int id)
        {
            Map m = db.Maps.Find(id);
            var mapJson = JsonConvert.SerializeObject(m);
            JsonResult j = Json(mapJson);
            return j;
        }
        public ActionResult Search(int? Id)
        {
            //var mId = Server.HtmlEncode(id);
            return View();
        }
        [ActionName("Retrieve")] //Replaces Action Name "GetMarker Data" as Retrieve
        [HttpGet]
        public JsonResult GetMarkerData(string id = "1")
        {
            var message = Server.HtmlEncode(id);
            return Json(new { Message = message, name = "Kyle" }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SelectMap(String map)
        {
            String myMap = map;
            var mapJson = Json(map);
            return mapJson;
        }

        //public ActionResult GetMarkerObjectJSON()
        //{

        //}
        //[HttpPost]
        //public ActionResult PostMarker(CapstoneProject.Data.Circle Data)
        //{
        //    var json = Json(Data);
        //    db.Circles.Add
        //    db.Circles.Add(Data);
        //    db.SaveChanges();
        //    return json;
        //}

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Create(Map aMap)
        {
            var id = aMap.Id;
            var userId = aMap.UserId;
            var user = db.Users.Find(userId);

            user.Maps.Single(m => m.Id == id).Annotates = aMap.Annotates;
            user.Maps.Single(m => m.Id == id).Boxes = aMap.Boxes;
            user.Maps.Single(m => m.Id == id).PolyLines = aMap.PolyLines;
            user.Maps.Single(m => m.Id == id).Circles = aMap.Circles;
            user.Maps.Single(m => m.Id == id).Lat = aMap.Lat;
            user.Maps.Single(m => m.Id == id).Lng = aMap.Lng;
            user.Maps.Single(m => m.Id == id).Zoom = aMap.Zoom;
            db.SaveChanges();

            //myMap.Circles.Add(circle);
            //db.SaveChanges();
            //return RedirectToAction("Index");

            //ViewBag.MapId = new SelectList(db.Maps, "Id", "Name", circle.MapId);
            return View("~/Views/Home/EditMapView.cshtml", aMap);
        }

        public ActionResult ListMapView()
        {
            return View();
        }

        //public ActionResult EditMapView()
        //{
        //    return View();
        //}

        public ActionResult Logout()
        {
            return PartialView();
        }

        
        public ActionResult ListMap(int myUserId)
        {
            var currentUser = db.Users.Find(myUserId);

            return View("~/Views/Home/ListMapView.cshtml", currentUser);
        }

        public ActionResult Delete(string name)
        {
            var mapName = Server.HtmlEncode(name);
            var mapID = Convert.ToInt16(mapName);
            Map myMap = db.Maps.Find(mapID);
            
            if(myMap != null)
            {
                db.Maps.Remove(myMap);
                db.SaveChanges();
            }
            var findUser = Session["User"] as User;
            var currentUser = db.Users.Find(findUser.Id);
            //update Session
            Session["User"] = currentUser;

            return View("ListMapView", currentUser);
        }
    }
}