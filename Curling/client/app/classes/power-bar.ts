const MAXANISOTROPY = 10;

export class PowerBar
{
    private mesh : THREE.Mesh;
    private height : number;
    private width : number;

    constructor()
    {
        if (window)
        {
            this.height = window.innerHeight / 1.5;
            this.width = window.innerWidth / 20;
        }
    }

    private addShape( shape : THREE.Shape, color : number)
    {
        let geometry = new THREE.ShapeGeometry(shape);
        this.mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial(
        {
            color: color,
            transparent : true,
            opacity : 0.3
        }));
        this.mesh.position.set(window.innerWidth / 3, - window.innerHeight / 3, 0);
    }

    public makeShape(force : number, color : number) : THREE.Mesh
    {
        let rectHeight = force * this.height + 1,
            rectWidth = this.width,
            rectShape = new THREE.Shape();
        rectShape.moveTo(0, 0);
        rectShape.lineTo(0, rectHeight);
        rectShape.lineTo(rectWidth, rectHeight);
        rectShape.lineTo(rectWidth, 0);
        rectShape.lineTo(0, 0);
        this.addShape(rectShape, color);
        return this.mesh;
    }

    public makeGraduatedBar() : THREE.Mesh
    {
        let loader = new THREE.TextureLoader();
        let texture = loader.load("../assets/images/powerBar.png");
        texture.anisotropy = MAXANISOTROPY;
        let material = new THREE.MeshBasicMaterial(
        {
            map : texture,
            transparent : true,
            opacity : 0.7
        });
        let plane = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.height), material);
        plane.position.set(window.innerWidth / 3 + this.width / 2, 0, -1);
        return plane;
    }
}
