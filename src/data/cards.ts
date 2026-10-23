import type { Card, Domain } from '../types';

const D = {
  cc: 'Cloud Concepts', ar: 'Architecture', cn: 'Compute & Network',
  st: 'Storage & Data', si: 'Security & Identity', gc: 'Governance & Cost',
} as const satisfies Record<string, Domain>;

// [id, domain, question, answer, confusedWith?]  ← add your own cards here
type Row = [string, Domain, string, string, string?];
const rows: Row[] = [
  ['iaas', D.cc, 'IaaS vs PaaS vs SaaS?', 'IaaS: you manage OS + apps (VMs). PaaS: you manage only apps/data (App Service). SaaS: vendor manages all (Microsoft 365).', 'shared'],
  ['shared', D.cc, 'Shared responsibility model?', 'Microsoft secures the physical layer. You ALWAYS own your data, identities and devices. The rest shifts with IaaS → PaaS → SaaS.', 'iaas'],
  ['capex', D.cc, 'CapEx vs OpEx?', 'CapEx = upfront spend on assets. OpEx = pay-as-you-go. Cloud moves you from CapEx to OpEx.'],
  ['elastic', D.cc, 'Scalability vs Elasticity?', 'Scalability = can add resources for more load. Elasticity = automatically scales out AND back in to match demand.', 'ha'],
  ['ha', D.cc, 'High availability vs Disaster recovery?', 'HA minimises downtime (SLA %). DR restores service after a major outage or region loss.', 'elastic'],
  ['hybrid', D.cc, 'Public vs Private vs Hybrid cloud?', 'Public: shared provider infra. Private: dedicated to one org. Hybrid: both connected, workloads move between them.'],
  ['region', D.ar, 'Region vs Availability Zone?', 'Region = group of datacenters in a latency zone. AZ = separate datacenter(s) inside a region with independent power, cooling, network.', 'pair'],
  ['pair', D.ar, 'What are region pairs?', 'Two regions in the same geography, 300+ miles apart. Updates roll out sequentially; recovery is prioritised.', 'region'],
  ['rg', D.ar, 'What is a resource group?', 'Logical container for related resources. A resource lives in exactly one group; deleting the group deletes everything inside.'],
  ['sub', D.ar, 'Subscription vs Management group?', 'Subscription = billing + access boundary holding resource groups. Management group = container ABOVE subscriptions to apply policy/RBAC at scale.', 'mg'],
  ['mg', D.ar, 'What do management groups do?', 'Organise many subscriptions in a hierarchy (up to 6 levels) so governance flows down automatically.', 'sub'],
  ['arm', D.ar, 'What is Azure Resource Manager (ARM)?', 'The deployment & management layer. Portal, CLI, PowerShell and SDKs all go through it. Supports ARM templates / Bicep (IaC).'],
  ['vmss', D.cn, 'Scale Sets vs Availability Sets?', 'VM Scale Sets: identical VMs that autoscale. Availability Sets: spread VMs across fault/update domains within one datacenter.', 'region'],
  ['func', D.cn, 'Azure Functions?', 'Serverless, event-triggered code. Pay per execution; no servers to manage.', 'appsvc'],
  ['appsvc', D.cn, 'Azure App Service?', 'PaaS for web apps, APIs and mobile backends. No OS management, built-in scaling and CI/CD.', 'func'],
  ['aks', D.cn, 'ACI vs AKS?', 'ACI: run a container fast, no orchestration. AKS: managed Kubernetes to orchestrate many containers.'],
  ['nsg', D.cn, 'NSG vs Azure Firewall?', 'NSG: basic allow/deny rules at subnet or NIC. Azure Firewall: managed, stateful, centralised firewall across VNets.', 'fw'],
  ['fw', D.cn, 'What is Azure Firewall?', 'Managed stateful firewall-as-a-service with FQDN filtering and threat intelligence; centrally manages rules across VNets.', 'nsg'],
  ['vpn', D.cn, 'VPN Gateway vs ExpressRoute?', 'VPN Gateway: encrypted tunnel over the public internet. ExpressRoute: private dedicated connection, NOT over the internet.'],
  ['blob', D.st, 'Blob Storage & its tiers?', 'Object storage for unstructured data. Tiers: Hot → Cool → Cold → Archive (cheaper storage, costlier/slower access).'],
  ['redund', D.st, 'LRS vs ZRS vs GRS?', 'LRS: 3 copies, one datacenter. ZRS: across 3 AZs. GRS: LRS + async copy to paired region. GZRS: ZRS + geo copy.'],
  ['cosmos', D.st, 'Azure SQL Database vs Cosmos DB?', 'SQL DB: managed relational PaaS. Cosmos DB: globally distributed multi-model NoSQL with low latency.'],
  ['files', D.st, 'Azure Files?', 'Managed file shares over SMB/NFS, mountable from cloud or on-premises.'],
  ['entra', D.si, 'Microsoft Entra ID?', 'Cloud identity service (formerly Azure AD): AUTHENTICATION - who you are. Supports SSO, MFA, Conditional Access.', 'rbac'],
  ['rbac', D.si, 'What is Azure RBAC?', 'AUTHORISATION - what you can do. Assign roles (Owner, Contributor, Reader) to identities at a scope; inherited downward.', 'entra'],
  ['ca', D.si, 'What is Conditional Access?', 'If-then policies using signals (location, device, risk) to allow, block or require MFA.'],
  ['zt', D.si, 'Zero Trust principles?', 'Verify explicitly · Use least-privilege access · Assume breach.'],
  ['did', D.si, 'Defence in depth layers?', 'Physical → Identity → Perimeter → Network → Compute → Application → Data.'],
  ['policy', D.gc, 'Azure Policy vs RBAC?', 'Policy controls what RESOURCES may look like (e.g. allowed regions). RBAC controls what USERS can do.', 'rbac'],
  ['lock', D.gc, 'Resource locks?', 'CanNotDelete or ReadOnly. Stop accidental changes, apply to all child resources, override even Owner permissions.'],
  ['tags', D.gc, 'What are tags?', 'Name/value metadata for organising resources and slicing cost reports. NOT inherited by default.'],
  ['calc', D.gc, 'Pricing Calculator vs TCO Calculator?', 'Pricing: estimate monthly cost of Azure services. TCO: compare on-prem cost against Azure to show savings.'],
  ['advisor', D.gc, 'Azure Advisor?', 'Personalised best-practice recommendations: reliability, security, performance, cost, operational excellence.', 'monitor'],
  ['monitor', D.gc, 'Azure Monitor vs Service Health?', 'Monitor: collect/analyse telemetry from your resources. Service Health: Azure-side incidents and maintenance affecting you.', 'advisor'],
];

export const CARDS: Card[] = rows.map(([id, domain, q, a, confusedWith]) => ({ id, domain, q, a, confusedWith }));
export const DOMAINS: Domain[] = Object.values(D);
