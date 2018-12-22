<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <title>Form Example</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
      Username: <asp:TextBox runat="server" Id="username"></asp:TextBox><br/>
        Password: <input type="password" name="password"/>
    </div>
        <div>
            <asp:Button runat="server" Text="Submit" OnClick="OnClick"/>
        </div>
        <div>
            <asp:Label runat="server" id="result"></asp:Label>
        </div>
        <div><%=Result %></div>
        
    </form>
</body>
</html>
