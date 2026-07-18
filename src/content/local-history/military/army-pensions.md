---
title: "Military Service"
permalink: /local-history/military/army-pensions/
layout: layouts/page.njk
oldPath: "/Local History/Military/ArmyPensions.aspx"
---

<h1>Military Service</h1>
    <h2>IRA Medals & Pensions</h2>
    <h3>Source of information</h3>
    <p class="indentedText">
        Our database has been created by extrapolating relevant details published by the Dublin Military 
        Archives under their ‘Military Service Pension Collection (MSPC)’ and ‘Medals Series’. It is in two
        parts. Firstly, consisting of medals awarded to participance of the Easter Rising (1916) and by the
        War of Independence (1916-1921); coupled with pensions awarded. Two military medals are represented
        in this collection: 1916 Medal and The Service Medal (1914-1921).
    </p>
    <p class="indentedText">
        The database includes details of applicant’s memberships with; Óglaigh na hÉireann, National Army,
        Irish Republican Army, Irish Volunteers, Irish Citizen Army, Hibernian Rifles, Cumann na mBan, Fianna 
        Éireann, and Connaught Rangers.</p>
    <h3>Notes of explanation</h3>

    <table class="center">
        <tr>
            <td>Surname:</td>
            <td class="auto-style9">In the case of a married woman her maiden name appears in brackets in her surname if provided on original documentation.</td>
        </tr>
        <tr>
            <td>Files:</td>
            <td class="auto-style9">In many cases there will be more than one file, which are separated by ‘/’. Military department are prefixed MD. Whereas, Pensions Department are prefixed PD.</td>
        </tr>
    </table>


    <table class="center">
        <tr>
            <td class="auto-style6">
    
    
            </td>
            <td class="auto-style6">
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td colspan="3">
                
                    <AlternatingRowStyle BackColor="White" />
                    <Columns>
                        
                        
                        
                        
                        
                        
                        
                        
                    </Columns>
                    <EditRowStyle BackColor="#2461BF" />
                    <FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                    <HeaderStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                    <PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Center" />
                    <RowStyle BackColor="#EFF3FB" />
                    <SelectedRowStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
                    <SortedAscendingCellStyle BackColor="#F5F7FB" />
                    <SortedAscendingHeaderStyle BackColor="#6D95E1" />
                    <SortedDescendingCellStyle BackColor="#E9EBEF" />
                    <SortedDescendingHeaderStyle BackColor="#4870BE" />
                
                <br />
                
                    <AlternatingRowStyle BackColor="White" />
                    <Columns>
                        
                        
                        
                        
                        
                        
                        
                        
                        
                    </Columns>
                    <EditRowStyle BackColor="#2461BF" />
                    <FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                    <HeaderStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                    <PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Center" />
                    <RowStyle BackColor="#EFF3FB" />
                    <SelectedRowStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
                    <SortedAscendingCellStyle BackColor="#F5F7FB" />
                    <SortedAscendingHeaderStyle BackColor="#6D95E1" />
                    <SortedDescendingCellStyle BackColor="#E9EBEF" />
                    <SortedDescendingHeaderStyle BackColor="#4870BE" />
                
            </td>
        </tr>
        <tr>
            <td colspan="3">
                &nbsp;</td>
        </tr>
        <tr>
            <td colspan="3">
                " SelectCommand="SELECT [Organisation], [SuccessfulMedal], [Brigade], [Rank], [Division], [Unit], [Company], [MedalAwarded], [MedalID], [Applicant] FROM [MedalsMilitaryHistory] WHERE ([MedalID] = @MedalID)">
                    <SelectParameters>
                        
                    </SelectParameters>
                
            </td>
        </tr>
    </table>

    " SelectCommand="SELECT * FROM [MedalSurnames]">


    " SelectCommand="SELECT [Applicant], [DoB], [Occupation], [Townland], [Spouse], [Files], [Status], [MedalID] FROM [MedalApplicantDetails] WHERE ([Surname] = @Surname)">
        <SelectParameters>
            
        </SelectParameters>
    
    <br />
    <br />
<section class="search-skeleton" aria-label="Search coming soon">
<p><strong>Searchable records:</strong> this page will include a search of the society’s research collection. Data will be added when the hosting database export is available.</p>
</section>

