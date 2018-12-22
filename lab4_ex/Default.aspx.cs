using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    public string Result = "";
    protected void Page_Load(object sender, EventArgs e)
    {
       
    }

    protected void OnClick(object sender, EventArgs e)
    {
        var user = username.Text;        
        var user2 = Convert.ToString(Request["username"]);
        var pas = Convert.ToString(Request["password"]);

        Result = String.Format("User: {0}, password: {1}", user, pas);
        result.Text = Result;
        //Response.Write(Result);

    }
}