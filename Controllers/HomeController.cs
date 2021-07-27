using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ReactDemo.Models;

namespace ReactDemo.Controllers
{
    public class HomeController : Controller
    {
        private static readonly IList<CalcModel> _calc;

        static HomeController()
        {
            _calc = new List<CalcModel>() { };


        }

        public ActionResult Index()
        {
            return View(_calc);
        }

        [Route("Home/calcs")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult clacs()
        {
            return Json(_calc);
        }

        [Route("calcs/new")]
        [HttpPost]
        public ActionResult Addclac(CalcModel clac)
        {
            // Create a fake ID for this clac
            clac.Id = _calc.Count + 1;
            _calc.Add(clac);
            return Content("Success :)");
        }
        [Route("Home/remove")]
        [HttpDelete]
        public ActionResult Removeclac(CalcModel clac)
        {
            var c=_calc.IndexOf(clac);
            var r=_calc.Remove(clac);
            return Content($"Success :) {r}-{c}");
        }
        [Route("doCalc")]
        [HttpPost]
        public ActionResult DoCalc(decimal d, decimal d2, string opp)
        {
            decimal res = 0;
            try
            {
                var opper = OperationFactory.CreateOperate(opp);
                opper.NumberA = d;
                opper.NumberB = d2;
                res = opper.GetResult();
                var cal = new CalcModel() { Id = _calc.Count + 1, data = $"{d} {opp} {d2} = {res}", d = d, d2 = d2, opp = opp ,res=res};
                Addclac(cal);
            }
            catch (System.Exception ex)
            {
                return Content($"Error in calc: {ex.Message}");
            }

            return Content(res.ToString());
        }

    }
}